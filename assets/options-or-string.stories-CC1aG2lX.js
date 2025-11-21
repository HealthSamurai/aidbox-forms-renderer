import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as o,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=p({linkId:"date-wc-autocomplete-repeating-options-or-string",text:"Select a date",type:"date",repeats:!0,control:"autocomplete",answerConstraint:"optionsOrString",answerOption:u("date",["2025-02-01","2025-03-01","2025-04-01"])}),t=JSON.stringify(r.form.questionnaire,null,2),f={title:"Question/date/with item-control/autocomplete/repeating/with answer-options",component:o,parameters:i,argTypes:s},e={name:"options or string",args:{questionnaireSource:t},render:n=>a.jsx(o,{scenario:{name:"date-wc-autocomplete-repeating-options-or-string",title:"options or string",build:()=>r},questionnaireSource:n.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "date-wc-autocomplete-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const w=["OptionsOrString"];export{e as OptionsOrString,w as __namedExportsOrder,f as default};
