import { Request, Response } from 'express';
import { getDb } from '../lib/db';

export async function getProvinces(_req: Request, res: Response) {
  try {
    const db = getDb();
    const provinces = await db.collection('gn_division').aggregate([
      { $group: { _id: { code: "$properties.PROVINCE_C", name: "$properties.PROVINCE_N" } } },
      { $project: { code: "$_id.code", name: "$_id.name", _id: 0 } }
    ]).toArray();
    return res.json(provinces);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getDistricts(req: Request, res: Response) {
  try {
    const { provinceCode } = req.query;
    if (!provinceCode) return res.status(400).json({ error: 'provinceCode required' });
    const db = getDb();
    const districts = await db.collection('gn_division').aggregate([
      { $match: { "properties.PROVINCE_C": provinceCode } },
      { $group: { _id: { code: "$properties.DISTRICT_C", name: "$properties.DISTRICT_N" } } },
      { $project: { code: "$_id.code", name: "$_id.name", _id: 0 } }
    ]).toArray();
    return res.json(districts);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getDSDs(req: Request, res: Response) {
  try {
    const { districtCode } = req.query;
    if (!districtCode) return res.status(400).json({ error: 'districtCode required' });
    const db = getDb();
    const dsd = await db.collection('gn_division').aggregate([
      { $match: { "properties.DISTRICT_C": districtCode } },
      { $group: { _id: { code: "$properties.DSD_C", name: "$properties.DSD_N" } } },
      { $project: { code: "$_id.code", name: "$_id.name", _id: 0 } }
    ]).toArray();
    return res.json(dsd);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getGNDivisions(req: Request, res: Response) {
  try {
    const { dsdCode } = req.query;
    if (!dsdCode) return res.status(400).json({ error: 'dsdCode required' });
    const db = getDb();
    const gnDivisions = await db.collection('gn_division').find({ "properties.DSD_C": dsdCode })
      .project({ "properties.GND_NO": 1, "properties.GND_N": 1, _id: 0 })
      .toArray();
    return res.json(gnDivisions);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getGNDivisionByCode(req: Request, res: Response) {
  try {
    const { gnCode } = req.params;
    const db = getDb();
    const feature = await db.collection('gn_division').findOne({ "properties.GND_NO": gnCode });
    if (!feature) return res.status(404).json({ error: 'Not found' });
    const p = feature['properties'];
    const response = {
      gnDivisionCode: p.GND_NO,
      gnDivisionName: p.GND_N,
      provinceCode: p.PROVINCE_C,
      provinceName: p.PROVINCE_N,
      districtCode: p.DISTRICT_C,
      districtName: p.DISTRICT_N,
      dsdCode: p.DSD_C,
      dsdName: p.DSD_N,
      adminCode: p.ADMIN_CODE,
      population2020: p.Pop_2020,
      officer: p.GN_Officer,
      officerContact: p.GN_Offic_1,
      yearCreated: p.YEAR_CREAT,
      dataSource: p.DATA_SOURC,
      areaSqKm: p.Ext_SqKm,
    };
    return res.json(response);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
