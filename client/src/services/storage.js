import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'
import { storage } from './firebase'

export function uploadFoto(registroId, file, onProgress) {
  const nomeUnico = Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const storageRef = ref(storage, `fotos/${registroId}/${nomeUnico}`)

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

export function uploadArquivo(registroId, file, onProgress) {
  const nomeUnico = Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const storageRef = ref(storage, `arquivos/${registroId}/${nomeUnico}`)

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

export async function excluirFoto(fotoPath) {
  if (!fotoPath) return
  try {
    await deleteObject(ref(storage, fotoPath))
  } catch (e) {
    console.warn('Arquivo não encontrado no storage:', e)
  }
}
