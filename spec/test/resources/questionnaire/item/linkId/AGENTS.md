## Element

```json
{
  "id": "Questionnaire.item.linkId",
  "path": "Questionnaire.item.linkId",
  "short": "Unique id for item in questionnaire",
  "definition": "An identifier that is unique within the Questionnaire allowing linkage to the equivalent item in a QuestionnaireResponse resource.",
  "comment": "This ''can'' be a meaningful identifier (e.g. a LOINC code) but is not intended to have any meaning.  GUIDs or sequential numbers are appropriate here.\n\nLinkIds can have whitespaces and slashes by design. Tooling should not rely on linkIds being valid XHTML element IDs, and should not directly embed them as such",
  "requirements": "[QuestionnaireResponse](questionnaireresponse.html#) does not require omitted items to be included and may have some items that repeat, so linkage based on position alone is not sufficient.",
  "min": 1,
  "max": "1",
  "type": [
    {
      "code": "string"
    }
  ],
  "condition": ["que-2"],
  "constraint": [
    {
      "key": "que-15",
      "severity": "warning",
      "human": "Link ids should be 255 characters or less",
      "expression": "$this.length() <= 255",
      "source": "http://hl7.org/fhir/StructureDefinition/Questionnaire"
    }
  ],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": false,
  "mapping": [
    {
      "identity": "rim",
      "map": ".id"
    }
  ]
}
```
