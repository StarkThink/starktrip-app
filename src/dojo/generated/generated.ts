/* Autogenerated file. Do not edit manually. */

import { Account, AccountInterface, shortString } from "starknet";
import { DojoProvider } from "@dojoengine/core";

export type IWorld = Awaited<ReturnType<typeof setupWorld>>;

export interface MoveProps {
    account: Account | AccountInterface;
    game_id: number;
    pos_x: number;
    pos_y: number;
}

interface CreateGameProps {
    account: AccountInterface;
    username: string;
}

interface CreateRoundProps {
    account: AccountInterface;
    game_id: number;
}

interface EndGameProps {
    account: AccountInterface;
    game_id: number;
}
const game_contract = "game_system";

export async function setupWorld(provider: DojoProvider) {
    function actions() {

        const createGame = async ({ account, username }: CreateGameProps) => {
            try {
              return await provider.execute(
                account,
                game_contract,
                "create_game",
                [shortString.encodeShortString(username)],
              );
            } catch (error) {
              console.error("Error executing createGame:", error);
              throw error;
            }
          };

        const move = async ({ account, game_id, pos_x, pos_y }: MoveProps) => {
            try {
                return await provider.execute(
                    account,
                    game_contract,
                    "move",
                    [game_id, pos_x, pos_y]
                );
            } catch (error) {
                console.error("Error executing move:", error);
                throw error;
            }
        };

        const create_round = async ({ account, game_id}: CreateRoundProps) => {
            try {
                return await provider.execute(
                    account,
                    game_contract,
                    "create_round",
                    [game_id]
                );
            } catch (error) {
                console.error("Error executing create_round:", error);
                throw error;
            }
        };

        const end_game = async ({ account, game_id}: EndGameProps) => {
            try {
                return await provider.execute(
                    account,
                    game_contract,
                    "end_game",
                    [game_id]
                );
            } catch (error) {
                console.error("Error executing end_game:", error);
                throw error;
            }
        };
        return { createGame, move, create_round, end_game};
    }
    return {
        actions: actions(),
    };
}
