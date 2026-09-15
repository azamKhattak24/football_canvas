import { TeamRoster } from "@/components/teams/TeamRoster";

export default async function TeamPage({ params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = await params;
  return <TeamRoster teamId={teamId} />;
}
