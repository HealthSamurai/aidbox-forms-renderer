import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as r,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=p({linkId:"integer-wc-drop-down-non-repeating-options-or-type",text:"Enter integer value",type:"integer",repeats:!1,control:"drop-down",answerConstraint:"optionsOrType",answerOption:u("integer",[1,2,3])}),o=JSON.stringify(n.form.questionnaire,null,2),y={title:"Question/integer/with item-control/drop-down/non-repeating/with answer-options",component:r,parameters:i,argTypes:a},e={name:"options or type",args:{questionnaireSource:o},render:t=>s.jsx(r,{scenario:{name:"integer-wc-drop-down-non-repeating-options-or-type",title:"options or type",build:()=>n},questionnaireSource:t.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "integer-wc-drop-down-non-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const S=["OptionsOrType"];export{e as OptionsOrType,S as __namedExportsOrder,y as default};
