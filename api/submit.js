export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Preflight OK
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const {
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
      t_id,
      campaignId
    } = req.body;

    // Debug logging van inkomende data
    console.log('Ontvangen data van frontend:', req.body);

    // Campagnegegevens ophalen obv ID
    const campaigns = {
      "campaign-mycollections": { cid: 1882, sid: 34 },
      "campaign-unitedconsumers-man": { cid: 2905, sid: 34 },
      "campaign-unitedconsumers-vrouw": { cid: 2906, sid: 34 },
      "campaign-kiosk": { cid: 3499, sid: 34 },
      "campaign-ad": { cid: 3532, sid: 34 },
      "campaign-volkskrant": { cid: 3534, sid: 34 },
      "campaign-parool": { cid: 4192, sid: 34 },
      "campaign-trouw": { cid: 4193, sid: 34 },
      "campaign-bndestem": { cid: 4200, sid: 34 },
      "campaign-brabantsdagblad": { cid: 4198, sid: 34 },
      "campaign-degelderlander": { cid: 4196, sid: 34 },
      "campaign-destentor": { cid: 4199, sid: 34 },
      "campaign-eindhovensdagblad": { cid: 4197, sid: 34 },
      "campaign-pzc": { cid: 4194, sid: 34 },
      "campaign-tubantia": { cid: 4195, sid: 34 },
      "campaign-consubeheer": { cid: 4720, sid: 34 },
      "campaign-generationzero": { cid: 4555, sid: 34 },
      "campaign-hotelspecials": { cid: 4621, sid: 34 },
      "campaign-raadselgids": { cid: 3697, sid: 34 },
      "campaign-tuinmanieren": { cid: 4852, sid: 34 }
    };

    const campaign = campaigns[campaignId];

    if (!campaign) {
      console.error('Ongeldige campagne-ID:', campaignId);
      return res.status(400).json({ success: false, message: 'Invalid campaign ID' });
    }

    const dob = `${dob_day?.padStart(2, '0')}/${dob_month?.padStart(2, '0')}/${dob_year}`;
    const ipaddress = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '';
    const optindate = new Date().toISOString().split('.')[0] + '+0000';
    const campagne_url = req.headers.referer || '';

    const params = new URLSearchParams({
      cid: campaign.cid.toString(),
      sid: campaign.sid.toString(),
      f_2_title: gender || '',
      f_3_firstname: firstname || '',
      f_4_lastname: lastname || '',
      f_1_email: email || '',
      f_5_dob: dob,
      f_17_ipaddress: ipaddress,
      f_55_optindate: optindate,
      f_1322_transaction_id: t_id || '',
      f_1453_campagne_url: campagne_url,
      f_6_postcode: postcode || '',
      f_7_straat: straat || '',
      f_8_huisnummer: huisnummer || '',
      f_9_woonplaats: woonplaats || '',
      f_10_telefoon: telefoon || ''
    });

    const response = await fetch('https://crsadvertising.databowl.com/api/v1/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    const result = await response.json();

    console.log('Databowl antwoord:', result);

    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Fout bij verzenden naar Databowl:', error);
    return res.status(500).json({ success: false, message: 'Interne fout bij verzenden' });
  }
}
