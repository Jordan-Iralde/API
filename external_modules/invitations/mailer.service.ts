export async function sendInvitationMail(input: {
    to: string;
    subject: string;
    body: string;
}) {
    console.log("Sending invitation email");

    const response = await fetch(
        `${process.env.MAILER_API_URL}/api/send`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": "pk_nexo_b3d13a218584b8cb408b301d4b206529",
            },
            body: JSON.stringify(input),
        }
    );

    const text = await response.text();

    console.log("Status:", response.status);
    console.log("Response:", text);

    if (!response.ok) {
        throw new Error(
            `Mailer returned ${response.status}: ${text}`
        );
    }

    return JSON.parse(text);
}