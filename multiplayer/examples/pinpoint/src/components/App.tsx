import React, { useEffect, useState, useMemo } from "react"
import { Rune } from "../lib/Rune"
import styled from "styled-components/macro"
import { PanoramaView } from "./PanoramaView/PanoramaView"
import { GameState } from "../types/GameState"
import { GuessingMapView } from "./MapView/GuessingMapView"
import { ScoreboardView } from "./ScoreboardView/ScoreboardView"
import { useAtom, useSetAtom } from "jotai"
import { $game } from "../state/game"
import { $players } from "../state/players"
import { $myPlayerId } from "../state/myPlayerId"
import { useFlags } from "../state/flags"

export function App() {
  const [game, setGame] = useAtom($game)
  const [players, setPlayers] = useAtom($players)
  const setMyPlayerId = useSetAtom($myPlayerId)
  const { unsetFlag } = useFlags()

  useEffect(() => {
    Rune.initClient({
      visualUpdate: ({ newGame, players, yourPlayerId }) => {
        setGame(newGame as GameState)
        setPlayers(players)
        setMyPlayerId(yourPlayerId)
      },
    })
  }, [setGame, setMyPlayerId, setPlayers])

  const [view, setView] = useState<"panorama" | "map">("panorama")

  const roundFinished = useMemo(
    () =>
      game?.guesses.filter((guess) => guess.round === game?.currentRound)
        .length === game?.playerIds.length,
    [game?.currentRound, game?.guesses, game?.playerIds.length]
  )

  useEffect(() => {
    unsetFlag("startOfRoundShown")
    setView("panorama")
  }, [game?.sessionId, game?.currentRound, unsetFlag])

  if (!game || !players) return null

  return (
    <Root>
      {roundFinished ? (
        <ScoreboardView />
      ) : view === "panorama" ? (
        <PanoramaView onOpenMapClick={() => setView("map")} />
      ) : view === "map" ? (
        <GuessingMapView onBackClick={() => setView("panorama")} />
      ) : null}
    </Root>
  )
}

const Root = styled.div`
  width: 100%;
  height: 100%;
`