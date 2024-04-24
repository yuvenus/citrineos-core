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
import { EnvironmentalImpact } from './environmentalImpact';
import { EnergySource } from './energySource';


export interface EnergyMix { 
    is_green_energy: boolean;
    energy_sources?: Array<EnergySource>;
    environ_impact?: Array<EnvironmentalImpact>;
    supplier_name?: string;
    energy_product_name?: string;
}

