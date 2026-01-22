## Element

```json
{
  "id": "QuestionnaireResponse.basedOn",
  "path": "QuestionnaireResponse.basedOn",
  "short": "Request fulfilled by this QuestionnaireResponse",
  "definition": "A plan, proposal or order that is fulfilled in whole or in part by this questionnaire response.  For example, a ServiceRequest seeking an intake assessment or a decision support recommendation to assess for post-partum depression.",
  "requirements": "Supports traceability of responsibility for the questionnaire response and allows linkage of the response to the proposals/recommendations acted upon.",
  "alias": ["order"],
  "min": 0,
  "max": "*",
  "type": [
    {
      "code": "Reference",
      "targetProfile": [
        "http://hl7.org/fhir/StructureDefinition/CarePlan",
        "http://hl7.org/fhir/StructureDefinition/ServiceRequest"
      ]
    }
  ],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": true,
  "mapping": [
    {
      "identity": "workflow",
      "map": "Event.basedOn"
    },
    {
      "identity": "rim",
      "map": ".outboundRelationship[typeCode=FLFS].target"
    }
  ]
}
```
