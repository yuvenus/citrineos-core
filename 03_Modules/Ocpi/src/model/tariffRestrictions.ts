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


export interface TariffRestrictions { 
    start_time?: string;
    end_time?: string;
    start_date?: string;
    end_date?: string;
    min_kwh?: number;
    max_kwh?: number;
    min_current?: number;
    max_current?: number;
    min_power?: number;
    max_power?: number;
    min_duration?: number;
    max_duration?: number;
    day_of_week?: Array<TariffRestrictions.DayOfWeekEnum>;
    reservation?: TariffRestrictions.ReservationEnum;
}
export namespace TariffRestrictions {
    export type DayOfWeekEnum = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
    export const DayOfWeekEnum = {
        Monday: 'MONDAY' as DayOfWeekEnum,
        Tuesday: 'TUESDAY' as DayOfWeekEnum,
        Wednesday: 'WEDNESDAY' as DayOfWeekEnum,
        Thursday: 'THURSDAY' as DayOfWeekEnum,
        Friday: 'FRIDAY' as DayOfWeekEnum,
        Saturday: 'SATURDAY' as DayOfWeekEnum,
        Sunday: 'SUNDAY' as DayOfWeekEnum
    };
    export type ReservationEnum = 'RESERVATION' | 'RESERVATION_EXPIRES';
    export const ReservationEnum = {
        Reservation: 'RESERVATION' as ReservationEnum,
        ReservationExpires: 'RESERVATION_EXPIRES' as ReservationEnum
    };
}


