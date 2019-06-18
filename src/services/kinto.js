import Kinto from 'kinto'

export const db = new Kinto({
  remote: 'https://kinto-server-3wi5srugvq-uc.a.run.app/v1/'
})
