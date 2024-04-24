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
import { CdrToken } from './cdrToken';
import { SignedData } from './signedData';
import { ChargingPeriod } from './chargingPeriod';
import { Price } from './price';
import { Tariff } from './tariff';
import { CdrLocation } from './cdrLocation';


export interface CDR { 
    country_code: string;
    party_id: string;
    id: string;
    start_date_time: string;
    end_date_time: string;
    session_id?: string;
    cdr_token: CdrToken;
    auth_method: CDR.AuthMethodEnum;
    authorization_reference?: string;
    cdr_location: CdrLocation;
    meter_id?: string;
    currency: string;
    tariffs?: Array<Tariff>;
    charging_periods: Array<ChargingPeriod>;
    signed_data?: SignedData;
    total_cost: Price;
    total_fixed_cost?: Price;
    total_energy: number;
    total_energy_cost?: Price;
    total_time: number;
    total_time_cost?: Price;
    total_parking_time?: number;
    total_parking_cost?: Price;
    total_reservation_cost?: Price;
    remark?: string;
    invoice_reference_id?: string;
    credit?: boolean;
    credit_reference_id?: string;
    last_updated: string;
}
export namespace CDR {
    export type AuthMethodEnum = 'AUTH_REQUEST' | 'COMMAND' | 'WHITELIST';
    export const AuthMethodEnum = {
        AuthRequest: 'AUTH_REQUEST' as AuthMethodEnum,
        Command: 'COMMAND' as AuthMethodEnum,
        Whitelist: 'WHITELIST' as AuthMethodEnum
    };
}


