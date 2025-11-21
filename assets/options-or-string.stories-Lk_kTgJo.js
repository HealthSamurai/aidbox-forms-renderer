import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as n,c as p,m as c}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=p({linkId:"coding-wc-lookup-non-repeating-options-or-string",text:"Choose a code",type:"coding",repeats:!1,control:"lookup",answerConstraint:"optionsOrString",answerOption:c("coding",[{system:"http://example.org/codes",code:"a",display:"Code A"},{system:"http://example.org/codes",code:"b",display:"Code B"},{system:"http://example.org/codes",code:"c",display:"Code C"}])}),e=JSON.stringify(r.form.questionnaire,null,2),f={title:"Question/coding/with item-control/lookup/non-repeating/with answer-options",component:n,parameters:a,argTypes:i},o={name:"options or string",args:{questionnaireSource:e},render:t=>s.jsx(n,{scenario:{name:"coding-wc-lookup-non-repeating-options-or-string",title:"options or string",build:()=>r},questionnaireSource:t.questionnaireSource,defaultSource:e})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "coding-wc-lookup-non-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...o.parameters?.docs?.source}}};const y=["OptionsOrString"];export{o as OptionsOrString,y as __namedExportsOrder,f as default};
