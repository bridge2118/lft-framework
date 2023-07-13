import { NextApiRequest, NextApiResponse } from 'next';

const cloudinary = require('cloudinary').v2;

// cloudinary.config({
//   cloud_name: 'dityx8ldw',
//   api_key: '176521595758651',
//   api_secret: process.env.CLOUDINARY_SECRET
// });

export default function signature(req: NextApiRequest, res: NextApiResponse) {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
    },
    process.env.CLOUDINARY_SECRET
  );

  res.statusCode = 200;
  res.json({ signature, timestamp });
}
