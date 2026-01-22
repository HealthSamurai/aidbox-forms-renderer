## Element

```json
{
  "id": "Questionnaire.approvalDate",
  "path": "Questionnaire.approvalDate",
  "short": "When the questionnaire was approved by publisher",
  "definition": "The date on which the resource content was approved by the publisher. Approval happens once when the content is officially approved for usage.",
  "comment": "The 'date' element may be more recent than the approval date because of minor changes or editorial corrections.\n\nSee guidance around (not) making local changes to elements [here](canonicalresource.html#localization).",
  "min": 0,
  "max": "1",
  "type": [
    {
      "code": "date"
    }
  ],
  "mustSupport": false,
  "isModifier": false,
  "isSummary": false,
  "mapping": [
    {
      "identity": "workflow",
      "map": "Definition.approvalDate"
    },
    {
      "identity": "rim",
      "map": ".outboundRelationship[typeCode=\"SUBJ\"].act[classCode=CACT;moodCode=EVN;code=\"approval\"].effectiveTime"
    },
    {
      "identity": "objimpl",
      "map": "no-gen-base"
    }
  ]
}
```
