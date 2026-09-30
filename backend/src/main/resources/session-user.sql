SELECT u.id, u.name, u.image
FROM "Session" s JOIN "User" u ON u.id = s."userId"
WHERE s."sessionToken" = :token
AND s.expires > (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')
