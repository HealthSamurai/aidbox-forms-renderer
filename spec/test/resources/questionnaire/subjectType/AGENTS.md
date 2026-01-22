## Element

```json
{
  "id": "Questionnaire.subjectType",
  "path": "Questionnaire.subjectType",
  "short": "Resource that can be subject of QuestionnaireResponse",
  "definition": "The types of subjects that can be the subject of responses created for the questionnaire.",
  "comment": "If none are specified, then the subject is unlimited.",
  "requirements": "Allows enforcing that a QuestionnaireResponse only has a .subject element of the appropriate type.",
  "min": 0,
  "max": "*",
  "type": [
    {
      "code": "code"
    }
  ],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": true,
  "binding": {
    "extension": [
      {
        "url": "http://hl7.org/fhir/StructureDefinition/elementdefinition-bindingName",
        "valueString": "ResourceType"
      },
      {
        "url": "http://hl7.org/fhir/StructureDefinition/elementdefinition-isCommonBinding",
        "valueBoolean": true
      }
    ],
    "strength": "required",
    "description": "One of the resource types defined as part of this version of FHIR.",
    "valueSet": "http://hl7.org/fhir/ValueSet/resource-types|5.0.0"
  },
  "mapping": [
    {
      "identity": "workflow",
      "map": "Definition.subject[x]"
    },
    {
      "identity": "rim",
      "map": ".outboundRelationship[typeCode=META].target[classCode=OBS, moodCode=DEFN, isCriterion=true].participation.role.classCode"
    },
    {
      "identity": "w5",
      "map": "FiveWs.who"
    }
  ]
}
```
