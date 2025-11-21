import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as t,c as p,m as d}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=p({linkId:"coding-wc-radio-button-repeating-options-or-type",text:"Choose a code",type:"coding",repeats:!0,control:"radio-button",answerConstraint:"optionsOrType",answerOption:d("coding",[{system:"http://example.org/codes",code:"a",display:"Code A"},{system:"http://example.org/codes",code:"b",display:"Code B"},{system:"http://example.org/codes",code:"c",display:"Code C"}])}),o=JSON.stringify(r.form.questionnaire,null,2),S={title:"Question/coding/with item-control/radio-button/repeating/with answer-options",component:t,parameters:i,argTypes:a},e={name:"options or type",args:{questionnaireSource:o},render:n=>s.jsx(t,{scenario:{name:"coding-wc-radio-button-repeating-options-or-type",title:"options or type",build:()=>r},questionnaireSource:n.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "coding-wc-radio-button-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const b=["OptionsOrType"];export{e as OptionsOrType,b as __namedExportsOrder,S as default};
