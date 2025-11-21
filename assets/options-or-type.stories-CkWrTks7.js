import{j as n}from"./index-BsWNCus6.js";import{b as i,a,N as r,c as p,m as d}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=p({linkId:"coding-wc-slider-repeating-options-or-type",text:"Choose a code",type:"coding",repeats:!0,control:"slider",answerConstraint:"optionsOrType",answerOption:d("coding",[{system:"http://example.org/codes",code:"a",display:"Code A"},{system:"http://example.org/codes",code:"b",display:"Code B"},{system:"http://example.org/codes",code:"c",display:"Code C"}])}),o=JSON.stringify(t.form.questionnaire,null,2),S={title:"Question/coding/with item-control/slider/repeating/with answer-options",component:r,parameters:a,argTypes:i},e={name:"options or type",args:{questionnaireSource:o},render:s=>n.jsx(r,{scenario:{name:"coding-wc-slider-repeating-options-or-type",title:"options or type",build:()=>t},questionnaireSource:s.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "coding-wc-slider-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrType"];export{e as OptionsOrType,f as __namedExportsOrder,S as default};
