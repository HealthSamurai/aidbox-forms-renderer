import{j as r}from"./index-BsWNCus6.js";import{b as a,a as i,N as n,c,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=c({linkId:"coding-wc-autocomplete-non-repeating-options-only",text:"Choose a code",type:"coding",repeats:!1,control:"autocomplete",answerConstraint:"optionsOnly",answerOption:p("coding",[{system:"http://example.org/codes",code:"a",display:"Code A"},{system:"http://example.org/codes",code:"b",display:"Code B"},{system:"http://example.org/codes",code:"c",display:"Code C"}])}),o=JSON.stringify(t.form.questionnaire,null,2),S={title:"Question/coding/with item-control/autocomplete/non-repeating/with answer-options",component:n,parameters:i,argTypes:a},e={name:"options only",args:{questionnaireSource:o},render:s=>r.jsx(n,{scenario:{name:"coding-wc-autocomplete-non-repeating-options-only",title:"options only",build:()=>t},questionnaireSource:s.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "coding-wc-autocomplete-non-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOnly"];export{e as OptionsOnly,f as __namedExportsOrder,S as default};
