import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrammarConComponent } from './grammar-con.component';

describe('GrammarConComponent', () => {
  let component: GrammarConComponent;
  let fixture: ComponentFixture<GrammarConComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrammarConComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrammarConComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
