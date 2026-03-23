import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'
import { storage } from './firebase'

const MAX_LARGURA = 1920
const MAX_ALTURA = 1920
const QUALIDADE_JPEG = 0.8
const LOTE_PARALELO = 3

function comprimirImagem(file) {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve(file)
      return
    }

    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      let { width, height } = img
      if (width <= MAX_LARGURA && height <= MAX_ALTURA && file.size < 500_000) {
        resolve(file)
        return
      }

      const ratio = Math.min(MAX_LARGURA / width, MAX_ALTURA / height, 1)
      width = Math.round(width * ratio)
      height = Math.round(height * ratio)

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(file); return }
          const compressed = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: file.lastModified
          })
          resolve(compressed)
        },
        'image/jpeg',
        QUALIDADE_JPEG
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(file)
    }

    img.src = url
  })
}

function uploadUnico(pasta, registroId, file, onProgress) {
  const nomeUnico = Date.now() + '_' + Math.random().toString(36).slice(2, 8) + '_' + file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const storageRef = ref(storage, `${pasta}/${registroId}/${nomeUnico}`)

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file)

    task.on('state_changed',
      (snap) => {
        const pct = (snap.bytesTransferred / snap.totalBytes) * 100
        if (onProgress) onProgress(pct)
      },
      (err) => reject(err),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        resolve({ nome: file.name, url, path: storageRef.fullPath })
      }
    )
  })
}

export function uploadFoto(registroId, file, onProgress) {
  return uploadUnico('fotos', registroId, file, onProgress)
}

export function uploadArquivo(registroId, file, onProgress) {
  return uploadUnico('arquivos', registroId, file, onProgress)
}

export async function uploadFotosEmLote(registroId, files, onStatusUpdate) {
  const resultados = []
  const erros = []
  const total = files.length
  let concluidos = 0

  for (let i = 0; i < total; i += LOTE_PARALELO) {
    const lote = Array.from(files).slice(i, i + LOTE_PARALELO)

    const promessas = lote.map(async (file, idx) => {
      const indiceGlobal = i + idx
      try {
        if (onStatusUpdate) {
          onStatusUpdate({
            atual: indiceGlobal + 1,
            total,
            progresso: (concluidos / total) * 100,
            fase: 'comprimindo'
          })
        }

        const fileComprimido = await comprimirImagem(file)

        if (onStatusUpdate) {
          onStatusUpdate({
            atual: indiceGlobal + 1,
            total,
            progresso: (concluidos / total) * 100,
            fase: 'enviando'
          })
        }

        const resultado = await uploadUnico('fotos', registroId, fileComprimido, (pct) => {
          if (onStatusUpdate) {
            const progressoBase = (concluidos / total) * 100
            const progressoParcial = pct / total
            onStatusUpdate({
              atual: indiceGlobal + 1,
              total,
              progresso: progressoBase + progressoParcial,
              fase: 'enviando'
            })
          }
        })

        concluidos++
        return resultado
      } catch (err) {
        console.error(`Erro ao enviar ${file.name}:`, err)
        erros.push({ nome: file.name, erro: err.message })
        concluidos++
        return null
      }
    })

    const resultadosLote = await Promise.all(promessas)
    resultados.push(...resultadosLote.filter(Boolean))
  }

  if (onStatusUpdate) {
    onStatusUpdate({ atual: total, total, progresso: 100, fase: 'concluido' })
  }

  return { resultados, erros }
}

export async function uploadArquivosEmLote(registroId, files, onStatusUpdate) {
  const resultados = []
  const erros = []
  const total = files.length
  let concluidos = 0

  for (let i = 0; i < total; i += LOTE_PARALELO) {
    const lote = Array.from(files).slice(i, i + LOTE_PARALELO)

    const promessas = lote.map(async (file, idx) => {
      const indiceGlobal = i + idx
      try {
        const resultado = await uploadUnico('arquivos', registroId, file, (pct) => {
          if (onStatusUpdate) {
            const progressoBase = (concluidos / total) * 100
            const progressoParcial = pct / total
            onStatusUpdate({
              atual: indiceGlobal + 1,
              total,
              progresso: progressoBase + progressoParcial,
              fase: 'enviando'
            })
          }
        })

        concluidos++
        return resultado
      } catch (err) {
        console.error(`Erro ao enviar ${file.name}:`, err)
        erros.push({ nome: file.name, erro: err.message })
        concluidos++
        return null
      }
    })

    const resultadosLote = await Promise.all(promessas)
    resultados.push(...resultadosLote.filter(Boolean))
  }

  if (onStatusUpdate) {
    onStatusUpdate({ atual: total, total, progresso: 100, fase: 'concluido' })
  }

  return { resultados, erros }
}

export async function excluirFoto(fotoPath) {
  if (!fotoPath) return
  try {
    await deleteObject(ref(storage, fotoPath))
  } catch (e) {
    console.warn('Arquivo não encontrado no storage:', e)
  }
}
