import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["toast"]

  connect() {
    this.toastTargets.forEach((element) => {
        const sticky = element.dataset.sticky === "true"
      const toast = new window.bootstrap.Toast(element, {
        autohide:!sticky,
        delay: sticky ? 0 : (element.dataset.delay || 5000)
      })

      toast.show()

    })
  }
}