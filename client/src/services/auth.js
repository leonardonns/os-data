import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  doc,
  query,
  where
} from 'firebase/firestore'
import { db } from './firebase'

export const PERFIS_DISPONIVEIS = [
  'Administrador',
  'Administrativo',
  'Financeiro',
  'Motorista',
  'Mecânico',
  'Ajudante',
  'Retificador',
  'Soldador'
]

const SESSAO_KEY = 'rm_sessao'
const colecaoRef = collection(db, 'funcionarios')

export async function hashSenha(senha) {
  const encoder = new TextEncoder()
  const data = encoder.encode(senha)
  const buffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function fazerLogin(login, senha) {
  const q = query(colecaoRef, where('login', '==', login), where('ativo', '==', true))
  const snap = await getDocs(q)

  if (snap.empty) throw new Error('Usuário não encontrado ou inativo.')

  const funcDoc = snap.docs[0]
  const func = { id: funcDoc.id, ...funcDoc.data() }

  const senhaHash = await hashSenha(senha)
  if (func.senha !== senhaHash) throw new Error('Senha incorreta.')

  const sessao = { id: func.id, login: func.login, nome: func.nome, perfis: func.perfis || [] }
  localStorage.setItem(SESSAO_KEY, JSON.stringify(sessao))
  return sessao
}

export function fazerLogout() {
  localStorage.removeItem(SESSAO_KEY)
}

export function lerSessaoLocal() {
  try {
    const raw = localStorage.getItem(SESSAO_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export async function recuperarSessao() {
  const sessao = lerSessaoLocal()
  if (!sessao?.id) return null

  const snap = await getDoc(doc(db, 'funcionarios', sessao.id))
  if (!snap.exists()) {
    fazerLogout()
    return null
  }
  const func = { id: snap.id, ...snap.data() }
  if (func.ativo === false) {
    fazerLogout()
    return null
  }

  const atualizada = { id: func.id, login: func.login, nome: func.nome, perfis: func.perfis || [] }
  localStorage.setItem(SESSAO_KEY, JSON.stringify(atualizada))
  return atualizada
}

export async function seedAdmin() {
  const senhaHash = await hashSenha('admin123')
  const agora = new Date().toLocaleString('pt-BR')
  const admins = [
    { nome: 'Vinicius Monteiro', cargo: 'Administrador', login: 'vinicius' },
    { nome: 'Leonardo Neves', cargo: 'Administrador', login: 'leonardo' }
  ]

  const snap = await getDocs(colecaoRef)
  const todos = snap.docs.map(d => ({ id: d.id, ...d.data() }))

  for (const admin of admins) {
    const existente = todos.find(f => (f.nome || '').toLowerCase().trim() === admin.nome.toLowerCase())

    if (existente) {
      await updateDoc(doc(db, 'funcionarios', existente.id), {
        login: admin.login,
        senha: senhaHash,
        perfis: ['Administrador']
      })
      console.log(`Atualizado "${existente.nome}" com login "${admin.login}".`)
    } else {
      const novoId = doc(colecaoRef).id
      await setDoc(doc(db, 'funcionarios', novoId), {
        nome: admin.nome,
        cargo: admin.cargo,
        login: admin.login,
        senha: senhaHash,
        perfis: ['Administrador'],
        ativo: true,
        criadoEm: agora,
        atualizadoEm: ''
      })
      console.log(`Criado "${admin.nome}" com login "${admin.login}".`)
    }
  }

  console.log('Seed concluído! Senha padrão: admin123')
}
