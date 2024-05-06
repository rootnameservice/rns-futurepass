import { ApiPromise } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";
import { AnyJson, ExtrinsicPayloadValue } from "@polkadot/types/types";
import { objectSpread, u8aToHex } from "@polkadot/util";
import { toHex } from "viem";

export interface ExtrinsicPayload {
    api: ApiPromise,
    signer: string | KeyringPair,
    extrinsic: any // Fix any type -- mismatch in dependencies
}

/**
 * 
 * @param props 
 * @returns 
 */
export const createExtrinsicPayload = async (props: ExtrinsicPayload) => {
    const { api, signer, extrinsic } = props
    const { method, era, version, nonce, tip, assetId, hash } = extrinsic

    const result: Record<string, AnyJson> = {};

    // TODO: Check this furter - Am I using the correct values here?
    const payload: ExtrinsicPayloadValue = {
        blockHash: hash.toHex(),
        era: era.toHex(),
        method: method.toHex(),
        nonce: nonce.toHex(),
        tip: tip.toHex(),
        assetId,
        genesisHash: api.genesisHash.toHex(),
        specVersion: api.runtimeVersion.specVersion.toHex(),
        transactionVersion: api.runtimeVersion.transactionVersion.toHex(),
    }

    const payloadObj = objectSpread(result, payload)

    // const extrinsicPayload = api.createType('ExtrinsicPayload', payloadObj).toU8a({ method: true })
    const extrinsicPayload = api.registry
        .createTypeUnsafe('ExtrinsicPayload', [payloadObj, { version }])
    const data = u8aToHex(extrinsicPayload.toU8a({ method: true }))

    console.log("extrinsicPayload:: ", extrinsicPayload)

    return {
        payload: data,
        message: toHex("Register a name: Trial and Error")
    }

}