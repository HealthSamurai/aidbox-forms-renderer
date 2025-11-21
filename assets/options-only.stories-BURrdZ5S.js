import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as n,c as d,m as c}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=d({linkId:"coding-wc-radio-button-non-repeating-options-only",text:"Choose a code",type:"coding",repeats:!1,control:"radio-button",answerConstraint:"optionsOnly",answerOption:c("coding",[{system:"http://example.org/codes",code:"a",display:"Code A"},{system:"http://example.org/codes",code:"b",display:"Code B"},{system:"http://example.org/codes",code:"c",display:"Code C"}])}),e=JSON.stringify(t.form.questionnaire,null,2),S={title:"Question/coding/with item-control/radio-button/non-repeating/with answer-options",component:n,parameters:i,argTypes:a},o={name:"options only",args:{questionnaireSource:e},render:r=>s.jsx(n,{scenario:{name:"coding-wc-radio-button-non-repeating-options-only",title:"options only",build:()=>t},questionnaireSource:r.questionnaireSource,defaultSource:e})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "coding-wc-radio-button-non-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...o.parameters?.docs?.source}}};const f=["OptionsOnly"];export{o as OptionsOnly,f as __namedExportsOrder,S as default};
