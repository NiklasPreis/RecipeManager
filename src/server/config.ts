import path from 'path'

export const PORT = Number(process.env.PORT) || 3000
export const DATA_DIR = process.env.DATA_DIR ?? path.join(process.cwd(), 'data')
