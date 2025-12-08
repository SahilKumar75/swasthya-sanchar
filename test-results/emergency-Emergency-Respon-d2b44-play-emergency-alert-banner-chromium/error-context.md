# Page snapshot

```yaml
- dialog "Unhandled Runtime Error" [ref=e3]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - navigation [ref=e7]:
          - button "previous" [disabled] [ref=e8]:
            - img "previous" [ref=e9]
          - button "next" [disabled] [ref=e11]:
            - img "next" [ref=e12]
          - generic [ref=e14]: 1 of 1 error
          - generic [ref=e15]:
            - text: Next.js (14.2.3) is outdated
            - link "(learn more)" [ref=e17] [cursor=pointer]:
              - /url: https://nextjs.org/docs/messages/version-staleness
        - button "Close" [ref=e18] [cursor=pointer]:
          - img [ref=e20]
      - heading "Unhandled Runtime Error" [level=1] [ref=e23]
      - paragraph [ref=e24]: "Error: An unsupported type was passed to use(): [object Object]"
    - generic [ref=e25]:
      - heading "Source" [level=2] [ref=e26]
      - generic [ref=e27]:
        - link "src/app/emergency/[address]/page.tsx (8:27) @ params" [ref=e29] [cursor=pointer]:
          - generic [ref=e30]: src/app/emergency/[address]/page.tsx (8:27) @ params
          - img [ref=e31]
        - generic [ref=e35]: "6 | 7 | export default function EmergencyResponderPage({ params }: { params: Promise<{ address: string }> }) { > 8 | const { address } = use(params); | ^ 9 | 10 | return ( 11 | <div className=\"min-h-screen bg-gradient-to-br from-red-50 to-orange-100\">"
      - heading "Call Stack" [level=2] [ref=e36]
      - button "Show collapsed frames" [ref=e37] [cursor=pointer]
```