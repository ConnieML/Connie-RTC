import type { NextApiRequest, NextApiResponse } from 'next'
import { twilioClient } from '@/lib/twilioClient'
import {
  SyncMapItemInstance,
  SyncMapItemContextUpdateOptions,
  SyncMapItemListInstanceCreateOptions,
} from 'twilio/lib/rest/sync/v1/service/syncMap/syncMapItem'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req
  const syncMapSid = req.query.syncMapSid as string
  const syncMapItemKey = req.query.syncMapItemKey as string
  const serviceSid = process.env.TWILIO_SYNC_SERVICE_SID!

  if (method === 'GET') {
    if (syncMapItemKey) {
      const syncMapItem: SyncMapItemInstance = await twilioClient.sync.v1.services(serviceSid)
        .syncMaps(syncMapSid)
        .syncMapItems(syncMapItemKey)
        .fetch()
      res.status(200).json({ syncMapItem })
      return
    }
    const syncMapItems: SyncMapItemInstance[] = await twilioClient.sync.v1.services(serviceSid)
      .syncMaps(syncMapSid)
      .syncMapItems
      .list()
    res.status(200).json({ syncMapItems })
  } else if (method === 'POST') {
    const syncMapItem: SyncMapItemListInstanceCreateOptions = JSON.parse(req.body)
    await twilioClient.sync.v1.services(serviceSid)
      .syncMaps(syncMapSid)
      .syncMapItems
      .create(syncMapItem)
    res.status(200).json({ syncMapItem })
  } else if (method === 'PUT') {
    const syncMapItem: SyncMapItemContextUpdateOptions = JSON.parse(req.body)
    await twilioClient.sync.v1.services(serviceSid)
      .syncMaps(syncMapSid)
      .syncMapItems(syncMapItemKey)
      .update(syncMapItem)
    res.status(200).json({ syncMapItem })
  } else if (method === 'DELETE') {
    await twilioClient.sync.v1.services(serviceSid)
      .syncMaps(syncMapSid)
      .syncMapItems(syncMapItemKey)
      .remove()
    res.status(200).json({ syncMapItemKey })
  }
}
