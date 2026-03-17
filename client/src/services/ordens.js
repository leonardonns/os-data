import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  query
} from 'firebase/firestore'
import { db } from './firebase'

const colecaoRef = collection(db, 'ordens')

function agora() {
  return new Date().toLocaleString('pt-BR')
}

export async function carregarOrdens() {
  const q = query(colecaoRef, orderBy('criadoEm', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function criarOrdem(id, dados) {
  await setDoc(doc(db, 'ordens', id), {
    ...dados,
    criadoEm: agora(),
    atualizadoEm: ''
  })
}

export async function atualizarOrdem(id, dados) {
  await updateDoc(doc(db, 'ordens', id), {
    ...dados,
    atualizadoEm: agora()
  })
}

export async function excluirOrdem(id) {
  await deleteDoc(doc(db, 'ordens', id))
}

export function gerarId() {
  return doc(colecaoRef).id
}
