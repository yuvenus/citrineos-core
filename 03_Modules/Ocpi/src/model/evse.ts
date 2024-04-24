/**
 * Open Charge Point Interface (OCPI) 2.2
 * The Open Charge Point Interface (OCPI) enables a scalable, automated EV roaming setup between Charge Point Operators and eMobility Service Providers. It supports authorization, charge point information exchange (including live status updates and transaction events), charge detail record exchange, remote charge point commands and the exchange of smart-charging related information between parties.  This specification document is originally based on https://bitbucket.org/shareandcharge/ocn-node/src/master/examples/openapi-spec.json  [Apache License, Version 2.0]. The OCPI specification itself is licensed as Creative Commons Attribution-NoDerivatives 4.0 International https://creativecommons.org/licenses/by-nd/4.0/legalcode
 *
 * The version of the OpenAPI document: 2.2
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Connector } from './connector';
import { DisplayText } from './displayText';
import { GeoLocation } from './geoLocation';
import { Image } from './image';
import { StatusSchedule } from './statusSchedule';


export interface Evse { 
    /**
     * Uniquely identifies the EVSE within the CPOs platform (and suboperator platforms).
     */
    uid: string;
    evse_id?: string | null;
    status: Evse.StatusEnum;
    status_schedule?: Array<StatusSchedule>;
    capabilities?: Array<Evse.CapabilitiesEnum>;
    connectors: Array<Connector>;
    floor_level?: string;
    coordinates?: GeoLocation;
    physical_reference?: string;
    directions?: Array<DisplayText>;
    parking_restrictions?: Array<Evse.ParkingRestrictionsEnum>;
    images?: Array<Image>;
    last_updated: string;
}
export namespace Evse {
    export type StatusEnum = 'AVAILABLE' | 'BLOCKED' | 'CHARGING' | 'INOPERATIVE' | 'OUTOFORDER' | 'PLANNED' | 'REMOVED' | 'RESERVED' | 'UNKNOWN';
    export const StatusEnum = {
        Available: 'AVAILABLE' as StatusEnum,
        Blocked: 'BLOCKED' as StatusEnum,
        Charging: 'CHARGING' as StatusEnum,
        Inoperative: 'INOPERATIVE' as StatusEnum,
        Outoforder: 'OUTOFORDER' as StatusEnum,
        Planned: 'PLANNED' as StatusEnum,
        Removed: 'REMOVED' as StatusEnum,
        Reserved: 'RESERVED' as StatusEnum,
        Unknown: 'UNKNOWN' as StatusEnum
    };
    export type CapabilitiesEnum = 'CHARGING_PROFILE_CAPABLE' | 'CHARGING_PREFERENCES_CAPABLE' | 'CHIP_CARD_SUPPORT' | 'CONTACTLESS_CARD_SUPPORT' | 'CREDIT_CARD_PAYABLE' | 'DEBIT_CARD_PAYABLE' | 'PED_TERMINAL' | 'REMOTE_START_STOP_CAPABLE' | 'RESERVABLE' | 'RFID_READER' | 'TOKEN_GROUP_CAPABLE' | 'UNLOCK_CAPABLE';
    export const CapabilitiesEnum = {
        ChargingProfileCapable: 'CHARGING_PROFILE_CAPABLE' as CapabilitiesEnum,
        ChargingPreferencesCapable: 'CHARGING_PREFERENCES_CAPABLE' as CapabilitiesEnum,
        ChipCardSupport: 'CHIP_CARD_SUPPORT' as CapabilitiesEnum,
        ContactlessCardSupport: 'CONTACTLESS_CARD_SUPPORT' as CapabilitiesEnum,
        CreditCardPayable: 'CREDIT_CARD_PAYABLE' as CapabilitiesEnum,
        DebitCardPayable: 'DEBIT_CARD_PAYABLE' as CapabilitiesEnum,
        PedTerminal: 'PED_TERMINAL' as CapabilitiesEnum,
        RemoteStartStopCapable: 'REMOTE_START_STOP_CAPABLE' as CapabilitiesEnum,
        Reservable: 'RESERVABLE' as CapabilitiesEnum,
        RfidReader: 'RFID_READER' as CapabilitiesEnum,
        TokenGroupCapable: 'TOKEN_GROUP_CAPABLE' as CapabilitiesEnum,
        UnlockCapable: 'UNLOCK_CAPABLE' as CapabilitiesEnum
    };
    export type ParkingRestrictionsEnum = 'EV_ONLY' | 'PLUGGED' | 'DISABLED' | 'CUSTOMERS' | 'MOTORCYCLES';
    export const ParkingRestrictionsEnum = {
        EvOnly: 'EV_ONLY' as ParkingRestrictionsEnum,
        Plugged: 'PLUGGED' as ParkingRestrictionsEnum,
        Disabled: 'DISABLED' as ParkingRestrictionsEnum,
        Customers: 'CUSTOMERS' as ParkingRestrictionsEnum,
        Motorcycles: 'MOTORCYCLES' as ParkingRestrictionsEnum
    };
}


