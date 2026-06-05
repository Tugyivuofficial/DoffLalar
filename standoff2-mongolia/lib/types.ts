export type Mode = '5v5' | '2v2'
export type Team = 'CT' | 'T'
export type LobbyStatus = 'waiting' | 'started' | 'finished'
export type Profile = { id:string; username:string|null; avatar_url:string|null; points:number; wins_5v5:number; wins_2v2:number; losses_5v5:number; losses_2v2:number; created_at:string }
export type Lobby = { id:string; host_id:string; mode:Mode; map:string; room_code:string|null; is_private:boolean; status:LobbyStatus; winner_team:Team|null; created_at:string; host?:Profile }
export type LobbyMember = { id:string; lobby_id:string; user_id:string; team:Team|null; joined_at:string; profile?:Profile }
