import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as t,c as p,m as c}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=p({linkId:"coding-wc-text-box-non-repeating-options-or-type",text:"Choose a code",type:"coding",repeats:!1,control:"text-box",answerConstraint:"optionsOrType",answerOption:c("coding",[{system:"http://example.org/codes",code:"a",display:"Code A"},{system:"http://example.org/codes",code:"b",display:"Code B"},{system:"http://example.org/codes",code:"c",display:"Code C"}])}),o=JSON.stringify(n.form.questionnaire,null,2),x={title:"Question/coding/with item-control/text-box/non-repeating/with answer-options",component:t,parameters:i,argTypes:a},e={name:"options or type",args:{questionnaireSource:o},render:r=>s.jsx(t,{scenario:{name:"coding-wc-text-box-non-repeating-options-or-type",title:"options or type",build:()=>n},questionnaireSource:r.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "coding-wc-text-box-non-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const S=["OptionsOrType"];export{e as OptionsOrType,S as __namedExportsOrder,x as default};
