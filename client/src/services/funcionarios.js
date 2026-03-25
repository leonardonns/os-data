import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  orderBy,
  query,
  where
} from 'firebase/firestore'
import { db } from './firebase'

const colecaoRef = collection(db, 'funcionarios')
const movCol = collection(db, 'movimentacoes')

function agora() {
  return new Date().toLocaleString('pt-BR')
}

export function gerarIdFuncionario() {
  return doc(colecaoRef).id
}

export async function carregarFuncionarios(apenasAtivos = false) {
  const q = query(colecaoRef, orderBy('nome', 'asc'))
  const snap = await getDocs(q)
  const lista = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  if (apenasAtivos) return lista.filter(f => f.ativo !== false)
  return lista
}

export async function buscarFuncionario(id) {
  const snap = await getDoc(doc(db, 'funcionarios', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function criarFuncionario(id, dados) {
  await setDoc(doc(db, 'funcionarios', id), {
    nome: dados.nome || '',
    login: dados.login || '',
    senha: dados.senha || '',
    perfis: dados.perfis || [],
    ativo: true,
    criadoEm: agora(),
    atualizadoEm: ''
  })
}

export async function buscarFuncionarioPorLogin(login) {
  const q = query(colecaoRef, where('login', '==', login))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() }
}

export async function atualizarFuncionario(id, dados) {
  await updateDoc(doc(db, 'funcionarios', id), {
    ...dados,
    atualizadoEm: agora()
  })
}

export async function toggleAtivoFuncionario(id, ativo) {
  await updateDoc(doc(db, 'funcionarios', id), {
    ativo,
    atualizadoEm: agora()
  })
}

export async function carregarMovimentacoesPorFuncionario(funcionarioId) {
  const q = query(movCol, where('funcionarioId', '==', funcionarioId), orderBy('criadoEm', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function calcularItensEmPosse(funcionarioId) {
  const movs = await carregarMovimentacoesPorFuncionario(funcionarioId)
  const saldo = {}

  for (const mov of movs) {
    if (mov.tipoItem === 'peca') continue
    const key = mov.itemId
    if (!saldo[key]) {
      saldo[key] = { itemId: key, itemNome: mov.itemNome, tipoItem: mov.tipoItem, quantidade: 0 }
    }
    if (mov.tipoMovimentacao === 'reserva') {
      saldo[key].quantidade += mov.quantidade
    } else if (mov.tipoMovimentacao === 'devolucao') {
      saldo[key].quantidade -= mov.quantidade
    }
  }

  return Object.values(saldo).filter(s => s.quantidade > 0)
}
