
describe('顧客登録フローのE2Eテスト', () => {
  it('顧客情報入力 → 確認 → 登録 → 完了を確認', () => {
    // テスト対象ページにアクセスし、alertをスタブ化
    cy.visit('/yuka_misawa/customer/add.html', {
      onBeforeLoad(win) {
        cy.stub(win, 'alert').as('alertStub');
      }
    });
  
      // テストデータの読み込み
    cy.fixture('customerData').then((data) => {
      const uniqueContactNumber = `03-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;

      // フォームに値を入力
      cy.get('#companyName').type('テスト会社');
      cy.get('#industry').type('IT');
      cy.get('#contact').type('03-1234-5678');
      cy.get('#location').type('東京都');
  
      // 送信ボタンを押す（確認画面へ）
      cy.get('button[type="submit"]').click();
  
      // URLがadd-confirm.htmlになっていることを確認
      cy.url().should('include', 'add-confirm.html');
  
      // alert を直接検出
      cy.on('window:alert', (text) => {
          expect(text).to.eq('顧客を登録しました。');
      });  

      // 「登録する」ボタンをクリック
      cy.get('#register-btn').click();
      
      // 最終的にlist.htmlに遷移することを確認
      cy.url().should('include', 'list.html');
    });
  });
});

describe('顧客登録フォームのバリデーションテスト', () => {
  it('会社名が未入力だと確認画面に遷移しない', () => {
    cy.visit('/yuka_misawa/customer/add.html');

    // 他の必須項目だけ入力し、会社名は未入力
    cy.get('#industry').type('IT');
    cy.get('#contact').type('0312345678');
    cy.get('#location').type('東京');

    // 送信ボタンをクリック
    cy.get('button[type="submit"]').click();

    // 確認画面に遷移していないことを確認（URLで判定）
    cy.url().should('include', 'add.html');
  });
});

describe('顧客一覧 → 詳細画面の遷移テスト', () => {
  it('一覧画面から顧客の詳細画面に遷移できる', () => {
    cy.visit('/yuka_misawa/customer/list.html');

  // 顧客名リンクが表示されていることを確認
  cy.get("#customer-list a")
    .first()
    .should("have.attr", "href")
    .and("include", "detail.html?id=");

  // 顧客名リンクをクリック
  cy.get("#customer-list a").first().click();

  // 遷移後、顧客詳細画面のタイトルを検出（<h1>顧客詳細</h1>）
  cy.contains("h1", "顧客詳細").should("exist");

  // 入力フォームが表示されているか確認
  cy.get("#customer-form").should("exist");
  cy.get("#customer-detail-body input").should("have.length.greaterThan", 0);
  });
});