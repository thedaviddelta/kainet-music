/// <reference types="cypress" />

beforeEach(() => {
    cy.visit("/");
    cy.clearLocalStorage();
});

const clickBtn = (name: RegExp, role?: string) => (
    cy.findByRole(role ?? "button", { name })
        .click()
);

it("plays full playlist and updates the queue", () => {
    // play playlist
    cy.findAllByRole("img")
        .eq(3)
        .trigger("mouseover");
    clickBtn(/open playlist/i, "link");
    clickBtn(/play full playlist/i);

    // shuffle and repeat
    clickBtn(/shuffle/i);
    clickBtn(/repeat/i)
        .click();

    // queue
    clickBtn(/queue/i);
    cy.findAllByRole("button", { name: /go to/i })
        .eq(2)
        .click();

    // prev, next and pause
    clickBtn(/previous/i);
    clickBtn(/next/i);
    clickBtn(/pause/i);
});

it("searches and plays elements", () => {
    // search songs
    cy.findByRole("textbox", { name: /query/i })
        .type("queen");
    clickBtn(/search/i);
    cy.url().should("include", "/songs/queen");

    // play song
    cy.findAllByRole("img")
        .eq(3)
        .trigger("mouseover");
    clickBtn(/play song/i);
    clickBtn(/pause/i);

    // search videos
    cy.findByRole("combobox", { name: /type/i })
        .as("searchtype")
        .select("videos");
    clickBtn(/search/i);
    cy.url().should("include", "/videos/queen");

    // add video to queue
    cy.findAllByRole("button", { name: /more options/i })
        .first()
        .click();
    clickBtn(/add to queue/i, "menuitem");

    // search albums
    cy.get("@searchtype")
        .select("albums");
    clickBtn(/search/i);
    cy.url().should("include", "/albums/queen");

    // go back to home
    clickBtn(/logo/i, "link");
});

it("toggles searchbar and player in mobile", () => {
    cy.viewport("samsung-s10");

    // search
    clickBtn(/open search/i);
    cy.findByRole("textbox", { name: /query/i })
        .type("queen");
    clickBtn(/^search$/i);
    cy.url().should("include", "/songs/queen");
    clickBtn(/close search/i);

    // play song
    cy.findAllByRole("button", { name: /play song/i })
        .eq(2)
        .click();

    // collapsed player
    clickBtn(/pause/i);
    clickBtn(/toggle player collapse/i);

    // fullscreen player
    clickBtn(/shuffle/i);
    clickBtn(/repeat/i);
    clickBtn(/next/i);
    clickBtn(/previous/i);
    clickBtn(/close/i);
});

it("skips to main and toggles color mode", () => {
    cy.findByRole("link", { name: /skip to content/i })
        .focus()
        .click()
        .url()
        .should("include", "#main");

    const white = "rgb(255, 255, 255)";
    cy.get("body")
        .should("not.have.css", "background-color", white);
    cy.findByRole("button", { name: /toggle color mode/i })
        .as("toggler")
        .click()
        .get("body")
        .should("have.css", "background-color", white);
    cy.get("@toggler")
        .click()
        .get("body")
        .should("not.have.css", "background-color", white);
});
