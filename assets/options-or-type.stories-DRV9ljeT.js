import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as r,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=p({linkId:"decimal-wc-lookup-repeating-options-or-type",text:"Enter decimal value",type:"decimal",repeats:!0,control:"lookup",answerConstraint:"optionsOrType",answerOption:u("decimal",[1.5,2,2.5])}),o=JSON.stringify(t.form.questionnaire,null,2),g={title:"Question/decimal/with item-control/lookup/repeating/with answer-options",component:r,parameters:i,argTypes:s},e={name:"options or type",args:{questionnaireSource:o},render:n=>a.jsx(r,{scenario:{name:"decimal-wc-lookup-repeating-options-or-type",title:"options or type",build:()=>t},questionnaireSource:n.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "decimal-wc-lookup-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrType"];export{e as OptionsOrType,f as __namedExportsOrder,g as default};
