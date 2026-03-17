import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase'

function agora() {
  return new Date().toLocaleString('pt-BR')
}

export async function carregarFicha(ordemId) {
  const snap = await getDoc(doc(db, 'fichasTecnicas', ordemId))
  return snap.exists() ? snap.data() : null
}

export async function salvarFicha(ordemId, dados) {
  await setDoc(doc(db, 'fichasTecnicas', ordemId), {
    ...dados,
    atualizadoEm: agora()
  }, { merge: true })
}

export function fichaVazia() {
  return {
    examesPreliminares: {},
    cabecoteMotor: {},
    comandosValvulas: {},
    bloco: {},
    pistao: {},
    biela: {},
    bronzinas: {},
    virabrequim: {}
  }
}
