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
      - paragraph [ref=e24]: "TypeError: params.then is not a function"
    - generic [ref=e25]:
      - heading "Source" [level=2] [ref=e26]
      - generic [ref=e27]:
        - link "src/app/emergency/[address]/page.tsx (13:12) @ then" [ref=e29] [cursor=pointer]:
          - generic [ref=e30]: src/app/emergency/[address]/page.tsx (13:12) @ then
          - img [ref=e31]
        - generic [ref=e35]: "11 | useEffect(() => { 12 | // Unwrap params promise for Next.js 15 compatibility > 13 | params.then((resolvedParams) => { | ^ 14 | setAddress(resolvedParams.address); 15 | setLoading(false); 16 | }).catch(() => {"
      - heading "Call Stack" [level=2] [ref=e36]
      - button "Show collapsed frames" [ref=e37] [cursor=pointer]
```