"use client"

import { useEffect } from "react"

export default function useHideClerk() {
  useEffect(() => {
    const interval = setInterval(() => {
      const xpath = "//p[text()='Secured by']/parent::div"
      const matchingElement = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue as HTMLElement

      if (matchingElement) {
        matchingElement.style.display = "none"
        clearInterval(interval)
      }
    }, 10)

    return () => clearInterval(interval)
  }, [])
}
