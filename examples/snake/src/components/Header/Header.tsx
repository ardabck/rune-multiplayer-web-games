import { styled } from "styled-components"
import { useAtomValue } from "jotai"
import { $game, $players, $yourPlayerId } from "../../state/state.ts"
import { rel } from "../../lib/rel.ts"
import noAvatar from "./noAvatar.png"
import background from "./background.jpg"
import { useMemo } from "react"
import { pickFreeColor } from "../../logic/pickFreeColor.ts"

export function Header() {
  // TODO: think how to avoid re-rendering on every tick because we use the full game state
  const game = useAtomValue($game)
  const players = useAtomValue($players)
  const yourPlayerId = useAtomValue($yourPlayerId)

  const invite = useMemo(
    () =>
      Object.keys(players).length < 4 ? { color: pickFreeColor(game) } : null,
    [game, players],
  )

  return (
    <Root>
      {game.players.map(({ playerId, color, score, state }) => (
        <PlayerContainer key={playerId}>
          {state === "pending" ? (
            <DarkCircle $playerColor={color} style={{ color: "white" }}>
              pending
            </DarkCircle>
          ) : state === "dead" ? (
            <DarkCircle $playerColor={color} style={{ color: "white" }}>
              dead
            </DarkCircle>
          ) : (
            <Avatar src={players[playerId].avatarUrl} $playerColor={color} />
          )}
          <Name $playerColor={color}>
            {playerId === yourPlayerId ? "You" : players[playerId].displayName}
          </Name>
          <Score $playerColor={state === "pending" ? "transparent" : color}>
            {score}
          </Score>
        </PlayerContainer>
      ))}
      {invite && (
        <PlayerContainer $center onClick={() => Rune.showInvitePlayers()}>
          <Avatar src={noAvatar} $playerColor={pickFreeColor(game)} />
          <Invite $playerColor={invite.color}>Invite</Invite>
        </PlayerContainer>
      )}
    </Root>
  )
}

const Root = styled.div`
  background:
    url("${background}") no-repeat center center / cover,
    black;
  display: flex;
`

const PlayerContainer = styled.div<{ $center?: boolean }>`
  height: ${rel(80)};
  width: 25vw;
  display: flex;
  align-items: center;
  justify-content: ${({ $center }) => ($center ? "center" : "flex-end")};
  flex-direction: column;
`

const Avatar = styled.img<{ $playerColor: string }>`
  width: ${rel(36)};
  height: ${rel(36)};
  border-radius: 50%;
  border: ${rel(2)} solid ${({ $playerColor }) => $playerColor};
  box-shadow: 0 0 ${rel(15)} ${rel(3)} ${({ $playerColor }) => $playerColor};
`

const Name = styled.div<{ $playerColor: string }>`
  margin-top: ${rel(-4)};

  background-color: ${({ $playerColor }) => $playerColor};
  padding: ${rel(2)} ${rel(4)};
  border-radius: ${rel(14)};
  box-shadow: 0 0 ${rel(15)} ${rel(3)} ${({ $playerColor }) => $playerColor};

  font-size: ${rel(9)};
`

const Invite = styled(Name)`
  font-size: ${rel(14)};
`

const Score = styled.div<{ $playerColor: string }>`
  color: ${({ $playerColor }) => $playerColor};
  text-shadow: 0 0 ${rel(15)} ${({ $playerColor }) => $playerColor};

  font-size: ${rel(24)};
`

const DarkCircle = styled.div<{ $playerColor: string }>`
  width: ${rel(36)};
  height: ${rel(36)};
  border-radius: 50%;
  box-shadow: 0 0 ${rel(15)} ${rel(3)} ${({ $playerColor }) => $playerColor};
`
