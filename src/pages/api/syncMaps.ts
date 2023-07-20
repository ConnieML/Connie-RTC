import type { NextApiRequest, NextApiResponse } from 'next'
import { twilioClient } from '@/lib/twilioClient'
import {
  SyncMapInstance,
  SyncMapContextUpdateOptions,
} from 'twilio/lib/rest/sync/v1/service/syncMap'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req
  const syncMapSid = req.query.syncMapSid as string
  const serviceSid = process.env.TWILIO_SYNC_SERVICE_SID!

  if (method === 'GET') {
    if (syncMapSid) {
      const syncMap: SyncMapInstance = await twilioClient.sync.v1.services(serviceSid)
        .syncMaps(syncMapSid)
        .fetch()
      res.status(200).json({ syncMap })
      return
    }
    const syncMaps: SyncMapInstance[] = await twilioClient.sync.v1.services(serviceSid)
      .syncMaps
      .list()
    res.status(200).json({ syncMaps })
  } else if (method === 'POST') {
    const syncMap: SyncMapContextUpdateOptions = JSON.parse(req.body)
    await twilioClient.sync.v1.services(serviceSid)
      .syncMaps
      .create(syncMap)
    res.status(200).json({ syncMap })
  } else if (method === 'PUT') {
    const syncMap: SyncMapContextUpdateOptions = JSON.parse(req.body)
    await twilioClient.sync.v1.services(serviceSid)
      .syncMaps(syncMapSid)
      .update(syncMap)
    res.status(200).json({ syncMap })
  } else if (method === 'DELETE') {
    await twilioClient.sync.v1.services(serviceSid)
      .syncMaps(syncMapSid)
      .remove()
    res.status(200).json({ syncMapSid })
  }
}
