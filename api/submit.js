export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const {
    cid,
    sid,
    gender,
    firstname,
    lastname,
    dob_day,
    dob_month,
    dob_year,
    email,
    postcode,
    straat,
    huisnummer,
    woonplaats,
    telefoon,
    t_id
  } = req.body;

  const dob = `${dob_day.padStart(2, '0')}/${dob_month.padStart(2, '0')}/${dob_year}`;
  const ipaddress = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '';
  const now = new Date();
  const optindate = now.toISOString().split('.')[0] + '+0000';
  const campagne_url = req.headers.referer || '';

  const params = new URLSearchParams({
    cid: String(cid),
    sid: String(sid),
    f_2_title: gender,
    f_3_firstname: firstname,
    f_4_lastname: lastname,
    f_1_email: email,
    f_5_dob: dob,
    f_6_postcode: postcode || '',
    f_7_straat: straat || '',
    f_8_huisnummer: huisnummer || '',
    f_9_woonplaats: woonplaats || '',
    f_10_telefoon: telefoon || '',
    f_17_ipaddress: ipaddress,
    f_55_optindate: optindate,
    f_1322_transaction_id: t_id,
    f_1453_campagne_url: campagne_url
  });

  try {
    const response = await fetch('https://crsadvertising.databowl.com/api/v1/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    const result = await response.json();
    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Databowl error:', error);
    return res.status(500).json({ success: false, message: 'Databowl request failed' });
  }
}
