import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as t,c as d,m as c}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=d({linkId:"coding-wc-radio-button-non-repeating-options-or-string",text:"Choose a code",type:"coding",repeats:!1,control:"radio-button",answerConstraint:"optionsOrString",answerOption:c("coding",[{system:"http://example.org/codes",code:"a",display:"Code A"},{system:"http://example.org/codes",code:"b",display:"Code B"},{system:"http://example.org/codes",code:"c",display:"Code C"}])}),e=JSON.stringify(n.form.questionnaire,null,2),f={title:"Question/coding/with item-control/radio-button/non-repeating/with answer-options",component:t,parameters:a,argTypes:i},o={name:"options or string",args:{questionnaireSource:e},render:r=>s.jsx(t,{scenario:{name:"coding-wc-radio-button-non-repeating-options-or-string",title:"options or string",build:()=>n},questionnaireSource:r.questionnaireSource,defaultSource:e})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "coding-wc-radio-button-non-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...o.parameters?.docs?.source}}};const b=["OptionsOrString"];export{o as OptionsOrString,b as __namedExportsOrder,f as default};
