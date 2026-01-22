## Element

```json
{
  "id": "Questionnaire.item.definition",
  "path": "Questionnaire.item.definition",
  "short": "ElementDefinition - details for the item",
  "definition": "This element is a URI that refers to an [ElementDefinition](elementdefinition.html) or to an [ObservationDefinition](observationdefinition.html) that provides information about this item, including information that might otherwise be included in the instance of the Questionnaire resource. A detailed description of the construction of the URI is shown in [Comments](questionnaire.html#definition), below.",
  "comment": "The uri refers to an ElementDefinition in a [StructureDefinition](structuredefinition.html#) or to an [ObservationDefinition](observationdefinition.html) and always starts with the [canonical URL](references.html#canonical) for the target resource. When referring to a StructureDefinition, a fragment identifier is used to specify the element definition by its id [Element.id](types-definitions.html#Element.id). E.g. http://hl7.org/fhir/StructureDefinition/Observation#Observation.value[x]. In the absence of a fragment identifier, the first/root element definition in the target is the matching element definition.",
  "requirements": "A common pattern is to define a set of data elements and then build multiple questionnaires for different circumstances to gather the data. This element provides traceability to the common definition and allows the content for the question to come from the underlying definition.",
  "min": 0,
  "max": "1",
  "type": [
    {
      "code": "uri"
    }
  ],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": false,
  "mapping": [
    {
      "identity": "rim",
      "map": ".outboundRelationship[typeCode=INST].target[classCode=OBS, moodCode=DEF]"
    }
  ]
}
```
