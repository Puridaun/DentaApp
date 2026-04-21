import KJUR from 'jsrsasign';

const clientEmail = "calendar-stoma@fair-melody-494012-e9.iam.gserviceaccount.com";
const privateKey = `-----BEGIN PRIVATE KEY-----\nMIIEugIBADANBgkqhkiG9w0BAQEFAASCBKQwggSgAgEAAoIBAQCuuXI9YZ6u2lTW\nKR9C2cevcDWGpr2GwCHi/r+2Wb5LvClwquvWgJ6+oNLlCyjPWkul+I62m8Cy8E4z\nEbdO8Xc3M66+h86ASGMm6BcvoChwcK7Rh2gGuPnWOhDDtjahZ05L16HlFP/qyoMv\nqVCj3Nsde4C6rgLLGI4UytsKqhJGx3GFuDE13Qlj3LDv/WeloGXfAreT/bOG+oUl\nQax3ADSVgEAM6LUC2oYnHk2FaM2txQX+D9bo/6A7Ij5zAd2mS/N97UaJ/xP8/3OV\nMFtkDxThLQvR3LubMjaLVqowOaXxOZrOL5Vhjp2hBeaVLGL7nLQaz18yJMNRsZW3\n5tJA9D8rAgMBAAECggEALrtR50HrV7f0ld0ky9QEuRMpdcy2B0rvJU/ehc6l+4ql\niMlmT5ZSHwlTrsgXz7HGZus+fG/XD+T+/WDBJv+lU6HinHolTKFPx7GuteG/vycc\nUtVFCPtDcz1Pi5D6NpwzUEyps+Q0eJ9WjBJci59ACbglG4j8HUcBhWUmRclsHvq6\n0IjfxiYHCQOTNnHokWhasx6yu0U73LjetXfyGRLmoIWFg9R5fLoZyg+SdYavHP7R\nJyOeYhiQAPGfYA1U79zaPFmwK5hqXUDlVyedmkgZINz2YcNJ6tKvvTHnFVmg06Fc\nJBiW4v5VqqFDr2ML+bhKaFPXPu5iMkOjSZY+pzE8RQKBgQDc0r70i7z+H3olgnlC\nE6RJRnT6is2ZzhAYg7ihc9C9A3gvKGTqmuA7JTeTdyZR2CzQ7syEGhemagILmTVw\nN2K++UuKEMKlpoHtffB9tYnLCY/BROobtuaa8S0HPcWi9o4kQGKcpyeYPw0/jn4t\nlkWqSAMgtzfqk1c4t1/VpsxCFwKBgQDKjsXaUqj2EVMy8cSgb4ph9jN36XHkonM+\nNGnU5OUlzoH8eFKcmGYKIW9ebl8ofy+1Nb/7d+2awvUQ6B2SY0gEmqgrWVaEB+Ix\ndm/TBY/vyErsh2rXW++tVYo8Xd5H4XspPn5J3wGPKi6ZEarOw54HxuumjMcTqhdc\n8pnle9S8DQKBgFo3g6p3WLxd8dJXTuEPE0SYk3w0rzESPgM19X2IypQeUcC6eRhc\nNBYV63HE8RPpBM5LcaTa4CSuFK3WZz20cxRg11rN5Cg3Mcfsdw901pnsCx5D4H14\nKRjORb46n38nygTHhUJJDGUoBWqc9bH8PfQGvbhlAmRE1BKo4G9yWOr7An86jQqk\nEUDF4DwsfbZYqeVWa9R01QYXEN4/HOd6oq+aPhdU43L90Q+t3fxTT5QyIJGpz9+u\n0PvdwH0WZgImToyCyDHUVf6sK5s2sQWh+fmhVkRSGtLHbcvaTt+mk3utS4BOa8IV\nmGDbAVZ26KR3IBSOKvHzMr5Y8NHQDFBwBVt5AoGAPfMrBjOt/65p2VpZvl2F3Ic4\n+6I8a+Q1UHLYtwg4v7fCs+NZZ125Njot9VOUrZsyw1QlRyR8yO0h8wYzBYS3WQUd\nOmPjmKSa0+NGTa14faaht11vD3VLZtUyqz/DDlY97GJulJtaPbGGfuVgAQVV6sjx\nYOzuqqQ+Ipc2f74MAoo=\n-----END PRIVATE KEY-----\n`.replace(/\\n/g, '\n');

async function getAccessToken() {
    const header = { alg: 'RS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const payload = {
        iss: clientEmail,
        scope: 'https://www.googleapis.com/auth/calendar.events',
        aud: 'https://oauth2.googleapis.com/token',
        exp: now + 3600,
        iat: now,
    };
    const sHeader = JSON.stringify(header);
    const sPayload = JSON.stringify(payload);
    const sJWT = KJUR.jws.JWS.sign('RS256', sHeader, sPayload, privateKey);
    const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${sJWT}`,
    });
    const data = await res.json();
    return data.access_token;
}

export const syncToGoogleCalendar = async (appointment, targetEmail) => {
    // Dacă doctorul nu are email setat în DB, trimitem la tine ca backup
    const finalEmail = targetEmail || "hritcuserafim01@gmail.com";

    try {
        const token = await getAccessToken();
        const startDateTime = new Date(`${appointment.date}T${appointment.time}`);
        const endDateTime = new Date(startDateTime.getTime() + 30 * 60000);

        const event = {
            summary: `🦷 ${appointment.procedure_name} - ${appointment.patient_name}`,
            description: appointment.note || '',
            start: { dateTime: startDateTime.toISOString(), timeZone: 'Europe/Bucharest' },
            end: { dateTime: endDateTime.toISOString(), timeZone: 'Europe/Bucharest' },
            reminders: {
                useDefault: false,
                overrides: [{ method: 'popup', minutes: 30 }]
            }
        };

        const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(finalEmail)}/events`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        });

        return await res.json();
    } catch (err) {
        console.error('Google Sync Error:', err);
    }
};