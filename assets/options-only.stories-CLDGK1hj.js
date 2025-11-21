import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as n,c as d,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=d({linkId:"coding-wc-drop-down-non-repeating-options-only",text:"Choose a code",type:"coding",repeats:!1,control:"drop-down",answerConstraint:"optionsOnly",answerOption:p("coding",[{system:"http://example.org/codes",code:"a",display:"Code A"},{system:"http://example.org/codes",code:"b",display:"Code B"},{system:"http://example.org/codes",code:"c",display:"Code C"}])}),e=JSON.stringify(t.form.questionnaire,null,2),w={title:"Question/coding/with item-control/drop-down/non-repeating/with answer-options",component:n,parameters:i,argTypes:a},o={name:"options only",args:{questionnaireSource:e},render:r=>s.jsx(n,{scenario:{name:"coding-wc-drop-down-non-repeating-options-only",title:"options only",build:()=>t},questionnaireSource:r.questionnaireSource,defaultSource:e})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "coding-wc-drop-down-non-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...o.parameters?.docs?.source}}};const S=["OptionsOnly"];export{o as OptionsOnly,S as __namedExportsOrder,w as default};
