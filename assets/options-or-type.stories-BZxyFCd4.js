import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as r,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=p({linkId:"integer-wc-lookup-repeating-options-or-type",text:"Enter integer value",type:"integer",repeats:!0,control:"lookup",answerConstraint:"optionsOrType",answerOption:u("integer",[1,2,3])}),o=JSON.stringify(t.form.questionnaire,null,2),S={title:"Question/integer/with item-control/lookup/repeating/with answer-options",component:r,parameters:a,argTypes:i},e={name:"options or type",args:{questionnaireSource:o},render:n=>s.jsx(r,{scenario:{name:"integer-wc-lookup-repeating-options-or-type",title:"options or type",build:()=>t},questionnaireSource:n.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "integer-wc-lookup-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrType"];export{e as OptionsOrType,f as __namedExportsOrder,S as default};
