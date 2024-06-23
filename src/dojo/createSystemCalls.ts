import { AccountInterface } from "starknet";
import { ClientComponents } from "./createClientComponents";
import { getNumberValueFromEvents } from "../utils/getNumberValueFromEvent";
import { CREATE_GAME_EVENT } from "../constants/dojoEventKeys";
import { getMoveEvents } from "../utils/getMoveEvents";
import {
    getEvents,
    setComponentsFromEvents,
} from "@dojoengine/utils";
import { ContractComponents } from "./generated/contractComponents";
import type { IWorld } from "./generated/generated";
import { getCreateRoundEvents } from "../utils/getCreateRoundEvents";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
    { client }: { client: IWorld },
    contractComponents: ContractComponents,
    { Board, CharactersInside }: ClientComponents
) {
    const createGame = async (account: AccountInterface, username: string) => {
        try {
            const { transaction_hash } = await client.actions.createGame({
              account,
              username,
            });
            const tx = await account.waitForTransaction(transaction_hash, {
              retryInterval: 100,
            });

            if (tx.isSuccess()) {
              const events = tx.events;
              let events_found = getEvents(tx);
              console.log("events", events_found);
              // This will update the contract models in the UI with the values that were set in the contract
              setComponentsFromEvents(contractComponents, events_found);
              // get game_id from CREATE_GAME_EVENT keys
              const game_id = getNumberValueFromEvents(events, CREATE_GAME_EVENT, false, 1);
              return game_id;
            } else {
              console.error("Error creating game:", tx);
              return false;
            }
          } catch (e) {
            console.log(e);
            return false;
          }
        };

    const move = async (account: AccountInterface, game_id: number, pos_x: number, pos_y: number) => {

        try {
            const { transaction_hash } = await client.actions.move({
              account,
              game_id,
              pos_x,
              pos_y,
            });
      
            const tx = await account.waitForTransaction(transaction_hash, {
              retryInterval: 100,
            });

            if (tx.isSuccess()) {
                const events = tx.events;
                let events_found = getEvents(tx);
                console.log("events", events_found);
                setComponentsFromEvents(contractComponents, events_found);
                return getMoveEvents(events);
            }
            return undefined;
        } catch (e) {
            console.log(e);
        }
    };

    const create_round = async (account: AccountInterface, game_id: number) => {

      try {
          const { transaction_hash } = await client.actions.create_round({
            account,
            game_id
          });
    
          const tx = await account.waitForTransaction(transaction_hash, {
            retryInterval: 100,
          });

          if (tx.isSuccess()) {
              const events = tx.events;
              let events_found = getEvents(tx);
              console.log("events", events_found);
              setComponentsFromEvents(contractComponents, events_found);
              return getCreateRoundEvents(events);
          }
          return undefined;
      } catch (e) {
          console.log(e);
      }
  };

  const end_game = async (account: AccountInterface, game_id: number) => {

    try {
        const { transaction_hash } = await client.actions.end_game({
          account,
          game_id,
        });
  
        const tx = await account.waitForTransaction(transaction_hash, {
          retryInterval: 100,
        });

        if (tx.isSuccess()) {
            const events = tx.events;
            let events_found = getEvents(tx);
            console.log("events", events_found);
            setComponentsFromEvents(contractComponents, events_found);
            return getMoveEvents(events);
        }
        return undefined;
    } catch (e) {
        console.log(e);
    }
};

    return {
        createGame,
        move,
        create_round,
        end_game
    };
}
