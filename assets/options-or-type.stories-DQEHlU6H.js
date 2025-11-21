import{j as n}from"./index-BsWNCus6.js";import{b as s,a as i,N as t,c as p,m as c}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=p({linkId:"decimal-wc-autocomplete-repeating-options-or-type",text:"Enter decimal value",type:"decimal",repeats:!0,control:"autocomplete",answerConstraint:"optionsOrType",answerOption:c("decimal",[1.5,2,2.5])}),o=JSON.stringify(r.form.questionnaire,null,2),g={title:"Question/decimal/with item-control/autocomplete/repeating/with answer-options",component:t,parameters:i,argTypes:s},e={name:"options or type",args:{questionnaireSource:o},render:a=>n.jsx(t,{scenario:{name:"decimal-wc-autocomplete-repeating-options-or-type",title:"options or type",build:()=>r},questionnaireSource:a.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "decimal-wc-autocomplete-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrType"];export{e as OptionsOrType,f as __namedExportsOrder,g as default};
