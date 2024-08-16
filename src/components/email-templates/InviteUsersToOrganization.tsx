interface InviteUsersToOrganizationTemplateProps {
  organizationName: string;
  acceptInvitationUrl: string;
}

export default function InviteUsersToOrganizationTemplate({
  organizationName,
  acceptInvitationUrl,
}: InviteUsersToOrganizationTemplateProps) {
  return (
    <div className="bg-background max-w-2xl mx-auto border rounded-md">
      <h1 className="text-2xl font-bold">
        Welcome to <pre>{process.env.APP_NAME}</pre>
      </h1>
      <p>
        You have been invited to join <strong>{organizationName}</strong>.
        Please click the link below to accept the invitation and create an
        account.
      </p>
      <p>
        <a href={acceptInvitationUrl}>Accept Invitation</a>
      </p>
    </div>
  );
}
