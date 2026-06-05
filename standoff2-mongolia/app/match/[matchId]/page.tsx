import AppShell from '@/components/AppShell'
import LobbyRoom from '@/components/LobbyRoom'
export default function MatchPage({params}:{params:{matchId:string}}){ return <AppShell><LobbyRoom lobbyId={params.matchId}/></AppShell> }
